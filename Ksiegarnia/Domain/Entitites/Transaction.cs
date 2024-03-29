﻿using Domain.Enums;

namespace Domain.Entitites
{
    public class Transaction
    {
        public Guid Id { get; set; }

        public string BuyerId { get; set; }

        public DateTime DateTime { get; set; }

        public Currency Currency { get; set; }

        public IEnumerable<EBookReader>? EBookReaders { get; set; }

        public Premium? Premium { get; set; }
        public bool Finished { get; set; }
    }
}
