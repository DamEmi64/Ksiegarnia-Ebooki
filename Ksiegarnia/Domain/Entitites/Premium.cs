﻿namespace Domain.Entitites
{
    public class Premium
    {
        public Guid Id { get; set; }

        public DateTime StartDate { get; set; } = DateTime.Now;

        public int DaysToFinishPremium { get; set; } = 0;

        public User User { get; set; }
    }
}
