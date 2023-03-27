using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class SendTokenDto
    {
        /// <summary>
        ///     Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        ///     Token
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        ///     Id
        /// </summary>
        public string Id { get; set; }
    }
}
