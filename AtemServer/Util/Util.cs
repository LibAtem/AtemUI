using System;
using System.Threading;
using System.Threading.Tasks;

namespace AtemServer.Util
{
    public static class Util
    {
        public static Action Debounce(this Action func, int milliseconds = 300)
        {
            CancellationTokenSource? cancelTokenSource = null;

            return () =>
            {
                cancelTokenSource?.Cancel();
                cancelTokenSource = new CancellationTokenSource();

                Task.Delay(milliseconds, cancelTokenSource.Token)
                    .ContinueWith(t =>
                    {
                        if (t.IsCompletedSuccessfully)
                        {
                            func();
                        }
                    }, TaskScheduler.Default);
            };
        }
    }
}