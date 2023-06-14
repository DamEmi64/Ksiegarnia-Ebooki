using Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GenreDto
    {
        /// <summary>
        ///     Genre Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     Genre name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Genre Description
        /// </summary>
        public string Description { get; set; }
    }

    public static class GenreConvert
    {
        public static GenreDto ToDTO(this Genre genre)
        {
            if (genre != null)
            {
                return new GenreDto
                {
                    Description = genre.Description,
                    Id = genre.Id,
                    Name = genre.Name
                };
            }

            return null;
        }

        public static IEnumerable<GenreDto> ToDTOs(this IEnumerable<Genre> genres)
        {
            foreach (var genre in genres)
            {
                yield return genre.ToDTO();
            }
        }
    }
}
