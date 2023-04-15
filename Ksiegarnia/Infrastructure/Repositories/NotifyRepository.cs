using Domain.Context;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotifyRepository : INotifyRepository
    {
        private readonly KsiegarniaContext _context;

        public NotifyRepository(KsiegarniaContext ksiegarniaContext)
        {
            _context = ksiegarniaContext;
        }

        public async Task Add(Notification notification)
        {
            await _context.Set<Notification>().AddAsync(notification);
        }

        public async Task ChangeStatus(Guid notificationId, NotificationStatus status)
        {
            var notify = await Get(notificationId);

            if (notify != null)
            {
                notify.Status = status;
                
            }
        }

        public async Task<Notification?> Get(Guid notificationId)
        {
          return  await _context.Set<Notification>().FirstOrDefaultAsync(x=>x.Id== notificationId);
        }

        public async Task<List<Notification>> GetAll()
        {
            return await _context.Set<Notification>().ToListAsync();
        }

        public async Task  Remove(Guid notificationId)
        {
            var notify = await Get(notificationId);

            if (notify != null)
            {
                _context.Remove(notify);
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
