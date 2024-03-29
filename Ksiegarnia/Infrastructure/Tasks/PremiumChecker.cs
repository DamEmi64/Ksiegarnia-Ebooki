﻿using Domain.Enums;
using Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Tasks
{
    /// <summary>
    ///     Check premium for users
    /// </summary>
    public class PremiumChecker : BackgroundTaskBase
    {
        private IServiceScopeFactory _serviceScopeFactory;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository">User repository</param>
        public PremiumChecker(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }


        public async override Task Execute()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();

                var users = await userRepository.GetUsers();

                foreach (var user in users)
                {
                    var premium = await userRepository.GetPremium(user.Id);

                    if (premium != null)
                    {
                        var isExpired = premium.StartDate.AddDays(premium.DaysToFinishPremium) < DateTime.UtcNow;

                        if (isExpired)
                        {
                            await userRepository.RemoveRole(user.Id, Roles.PremiumUser);
                        }
                    }
                }
            }
        }
    }
}
