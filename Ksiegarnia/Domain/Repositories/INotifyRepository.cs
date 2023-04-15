using Domain.Entitites;
using Domain.Enums;

namespace Domain.Repositories
{
    public interface INotifyRepository
    {
        Task Add(Notification notification);
        Task Remove(Guid notificationId);
        Task ChangeStatus(Guid notificationId, NotificationStatus status);
        Task<Notification?> Get(Guid notificationId);
        Task SaveChanges();
    }
}
