using Microsoft.Extensions.Hosting;

namespace Infrastructure.Tasks
{
    /// <summary>
    ///     Base for background services
    /// </summary>
    public abstract class BackgroundTaskBase : BackgroundService
    {

        /// <summary>
        ///     Timespan ( frequence) default is 1 day
        /// </summary>
        public TimeSpan Time { get; set; } = TimeSpan.FromDays(1);

        /// <summary>
        ///     Execute task
        /// </summary>
        /// <param name="cancellationToken">Cancellation Token</param>
        /// <returns></returns>
        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using PeriodicTimer timer = new PeriodicTimer(Time);
            while (
                !cancellationToken.IsCancellationRequested &&
                await timer.WaitForNextTickAsync(cancellationToken))
            {
                await Execute();
            }
        }

        /// <summary>
        ///     Execute every timespan
        /// </summary>
        public abstract Task Execute();
    }
}
