namespace Domain.DTOs
{
    public class HideInfoDto
    {
        /// <summary>
        ///     Is first name hidden
        /// </summary>
        public bool FirstName { get; set; }

        /// <summary>
        ///     Is email hidden
        /// </summary>
        public bool Email { get; set; }
        
        /// <summary>
        ///     Is last name hidden
        /// </summary>
        public bool LastName { get; set; }

        /// <summary>
        ///     Is phone hidden
        /// </summary>
        public bool Phone { get; set; }

        /// <summary>
        ///     Is age hidden
        /// </summary>
        public bool Age { get; set; }
    }
}
