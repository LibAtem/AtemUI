using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using LibAtem.Common;
using LibAtem.Net;
using LibAtem.Net.DataTransfer;
using LibAtem.State;
using LibAtem.Util;
using LibAtem.Util.Media;

namespace AtemServer
{
    public class AtemMediaCacheItem
    {
        public TaskCompletionSource<AtemFrame> Completion { get; }
        public uint Index { get; }
        
        public DataTransferJob Job;

        public AtemFrame RawFrame;
        public byte[] PreviewJpeg;
        
        public AtemMediaCacheItem(uint index)
        {
            Index = index;
            Completion = new TaskCompletionSource<AtemFrame>();
        }
    }
    
    public class AtemMediaCache
    {
        private readonly Dictionary<string, AtemMediaCacheItem> _cache = new Dictionary<string,AtemMediaCacheItem>();

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
                        string hashString = Convert.ToBase64String(still.Hash);
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
                        entry.Value.Job?.SetExpired();
                        _cache.Remove(entry.Key);
                    }
                }
                
                // Ensure each entry has been/is being loaded
                foreach (KeyValuePair<string, AtemMediaCacheItem> entry in _cache)
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

        private DataTransferJob DownloadStillJob(AtemMediaCacheItem item)
        {
            return new DownloadMediaStillJob(item.Index, VideoModeResolution._1080,
                ((AtemFrame frame) =>
                {
                    Console.WriteLine("Got job complete for {0} with {1}", item.Index, frame != null);
                    // TODO - why does it get fulfilled multiple times?
                    if (!item.Completion.Task.IsCompleted)
                    {
                        item.RawFrame = frame;
                        item.Job = null;
                        Task.Run(() =>
                        {
                            // Make sure the transfer thread isnt blocked 
                            item.Completion.SetResult(frame);
                        });
                    }

                }));
        }
    }
}