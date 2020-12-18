using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LibAtem.Common;
using LibAtem.Net;
using LibAtem.Net.DataTransfer;
using LibAtem.State;
using LibAtem.Util;
using LibAtem.Util.Media;

namespace AtemServer.Services
{
    public class AtemMediaCacheItem
    {
        public object JobLock { get; } = new object();
        
        public uint Index { get; }
        
        public DownloadMediaStillJob3 Job;
        public Task<AtemFrame> RawFrame;

        // public AtemFrame RawFrame;
        public byte[] PreviewJpeg;
        
        public AtemMediaCacheItem(uint index)
        {
            Index = index;
        }
    }
    
    public class AtemMediaCache
    {
        private readonly Dictionary<string, AtemMediaCacheItem> _cache = new Dictionary<string,AtemMediaCacheItem>();
        private readonly TransferJobMonitor _monitor;
        public AtemMediaCache(TransferJobMonitor monitor)
        {
            _monitor = monitor;
        }
        
        public AtemMediaCacheItem Get(string hash)
        {
            lock (_cache)
            {
                return _cache.TryGetValue(hash, out AtemMediaCacheItem item) ? item : null;
            }
        }

        public void EnsureMediaIsDownloaded(AtemClient client, AtemState state)
        {
            // TODO - ensure clips and audio
            
            lock (_cache)
            {
                var usedHashes = new HashSet<string>();
                
                // Ensure stills have entries in the cache
                state.MediaPool.Stills.ForEach((index, still) =>
                {
                    if (still.IsUsed)
                    {
                        string hashString = BitConverter.ToString(still.Hash).Replace("-", "");
                        usedHashes.Add(hashString);
                        
                        if (!_cache.ContainsKey(hashString))
                        {
                            _cache.Add(hashString, new AtemMediaCacheItem((uint) index));
                        }
                    }
                });

                // Prune out old entries
                foreach (KeyValuePair<string, AtemMediaCacheItem> entry in _cache)
                {
                    if (!usedHashes.Contains(entry.Key))
                    {
                        lock (entry.Value.JobLock)
                        {
                            entry.Value.Job?.Invalidate();
                        }

                        _cache.Remove(entry.Key);
                    }
                }
                
                // Ensure each entry has been/is being loaded
                foreach (KeyValuePair<string, AtemMediaCacheItem> entry in _cache)
                {
                    lock (entry.Value.JobLock)
                    {
                        if (entry.Value.RawFrame == null && entry.Value.Job == null)
                        {
                            // TODO - dynamic resolution
                            entry.Value.Job = DownloadStillJob(entry.Value);
                            client.DataTransfer.QueueJob(entry.Value.Job);
                        }
                    }
                }
            }
        }

        private DownloadMediaStillJob3 DownloadStillJob(AtemMediaCacheItem item)
        {
            var job = new DownloadMediaStillJob3(item.Index, VideoModeResolution._1080.GetByteCount());
            item.RawFrame = job.Result.ContinueWith<AtemFrame>(t =>
            {
                lock (item.JobLock)
                {
                    item.Job = null;

                    if (t.IsCompletedSuccessfully)
                        return t.Result;
                }

                if (t.IsFaulted)
                {
                    Console.WriteLine("Still download failed {0}", t.Exception);
                    return null;
                }
                
                return null;
            });
            return job;
        }
    }
}