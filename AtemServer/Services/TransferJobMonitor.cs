using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Collections.Specialized;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AtemServer.Hubs;
using LibAtem.Common;
using LibAtem.Net.DataTransfer;
using LibAtem.Util.Media;
using Microsoft.AspNetCore.SignalR;

namespace AtemServer.Services
{
    public class TransferJobMonitor
    {
        private readonly IHubContext<DevicesHub> _context;
        private readonly List<TransferJobEntry> _jobs; 

        public TransferJobMonitor(IHubContext<DevicesHub> context)
        {
            _context = context;
            _jobs = new List<TransferJobEntry>();
        }

        public ImmutableList<TransferJobEntry> ListTransfers()
        {
            lock (_jobs)
            {
                return _jobs.ToImmutableList();
            }
        }

        public void JobStarted(string deviceId, DataTransferJob job)
        {
            /*
            lock (_jobs)
            {
                foreach (TransferJobEntry entry in _jobs)
                {
                    if (ReferenceEquals(entry.Job, job))
                    {
                        
                    }
                }
            }
            */
            NotifyChanged(job);
        }

        public void JobQueued(string deviceId, DataTransferJob job)
        {
            if (job is DownloadMediaStillJob3 stillDownloadJob)
            {
                lock (_jobs)
                {
                    _jobs.Add(new StillDownloadJobEntry(deviceId, stillDownloadJob, NotifyChanged));
                }
            }
            else
            {
                Console.WriteLine("Unable to monitor job of unknown type {0}", job.GetType());
            }
        }

        private void NotifyChanged(DataTransferJob job)
        {
            _context.Clients.All.SendAsync("transfers", ListTransfers());
        }
    }

    public abstract class TransferJobEntry
    {
        [JsonIgnore]
        public DataTransferJob Job { get; protected set; }
        
        public string DeviceId { get; }
        public string Type { get; }
        
        public DateTime? QueuedAt = DateTime.Now;
        public DateTime? StartedAt => Job.StartedAt;
        public DateTime? CompletedAt { get; protected set; }
        public bool Success { get; protected set; }
        public string Status { get; protected set; }
        
        public double ProgressPercent { get; protected set; }

        protected TransferJobEntry(string deviceId, string type)
        {
            DeviceId = deviceId;
            Type = type;
        }
    }

    public class StillDownloadJobEntry: TransferJobEntry
    {
        private readonly Action<DataTransferJob> _notifyChanged;

        [JsonIgnore]
        public Task<AtemFrame> CompletionTask { get; }

        public uint Index { get; }
        
        public StillDownloadJobEntry(string deviceId, DownloadMediaStillJob3 job, Action<DataTransferJob> notifyChanged): base(deviceId, "Still")
        {
            _notifyChanged = notifyChanged;
            
            Index = job.StoreId;
            Job = job;
            
            job.OnProgress += (sender, bytes, totalBytes) =>
            {
                ProgressPercent = ((double) bytes) / totalBytes;
                _notifyChanged(job);
            };
            CompletionTask = job.Result.ContinueWith(t =>
            {
                CompletedAt = DateTime.Now;

                if (t.IsCompletedSuccessfully)
                {
                    Success = true;
                    _notifyChanged(job);
                    return t.Result;
                }

                if (t.IsFaulted)
                {
                    Status = $"Download failed: {t.Exception}";
                    Console.WriteLine("{0}: Still {1} {2}", deviceId, Index, Status);
                    _notifyChanged(job);
                    return null;
                }

                _notifyChanged(job);
                return null;
            });
        }

        public StillDownloadJobEntry(string deviceId, uint index, VideoModeResolution res, Action<DataTransferJob> notifyChanged) : this(deviceId,
            new DownloadMediaStillJob3(index, res.GetByteCount()), notifyChanged)
        {
        }

    }
}