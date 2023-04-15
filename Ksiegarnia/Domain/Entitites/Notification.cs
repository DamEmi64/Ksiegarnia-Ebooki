using Domain.Enums;

namespace Domain.Entitites
{
    public class Notification
    {
        /// <summary>
        ///     Notification status
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     Object id - what is about
        /// </summary>
        public string ObjectId {get;set;}

        /// <summary>
        ///     Description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Creation date
        /// </summary>
        public DateTime CreationDate { get; set; }

        /// <summary>
        ///     Status change date
        /// </summary>
        public DateTime StatusChangeDate { get; set; }
        /// <summary>
        ///     Notification status
        /// </summary>
        public NotificationStatus Status { get; set; }
    }
}
