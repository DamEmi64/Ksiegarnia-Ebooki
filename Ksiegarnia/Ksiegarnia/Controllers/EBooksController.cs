using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;

namespace Application.Controllers
{
    [Route("Ebooks")]
    [ApiController]
    public class EBooksController : Controller
    {
        private readonly IEBookRepository _repository;
        public EBooksController(IEBookRepository repository)
        {
            _repository = repository;
        }
        // GET: EBooks
        /// <summary>
        ///     Get Ebooks list
        /// </summary>
        /// <returns></returns>
        [HttpGet("index", Name = "Pobranie listy ebooków")]
        public async Task<List<EBook>> Index()
        {
            return await _repository.GetEBooks();
        }

        /// <summary>
        ///     Get Ebook by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpGet("{id}", Name = "Pobranie ebooka")]
        public async Task<EBook> Details(Guid? id)
        {
            if (id == null)
            {
                return new EBook();
            }

            var eBook = await _repository.GetEbook((Guid)id);
            if (eBook == null)
            {
                return new EBook();
            }

            return eBook;
        }

        // POST: EBooks/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost("/create", Name ="Stworzenie ebooka")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Create(EBook eBook)
        {
            if (ModelState.IsValid)
            {
                eBook.Id = Guid.NewGuid();
                await _repository.AddEbook(eBook);
                await _repository.SaveChanges();
                return HttpStatusCode.Created;
            }
            return HttpStatusCode.BadRequest;
        }

/*        // GET: EBooks/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null || _context.EBook == null)
            {
                return NotFound();
            }

            var eBook = await _context.EBook.FindAsync(id);
            if (eBook == null)
            {
                return NotFound();
            }
            return View(eBook);
        }*/
/*
        // POST: EBooks/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,Title,Content,Genre")] EBook eBook)
        {
            if (id != eBook.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(eBook);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EBookExists(eBook.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(eBook);
        }

        // GET: EBooks/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null || _context.EBook == null)
            {
                return NotFound();
            }

            var eBook = await _context.EBook
                .FirstOrDefaultAsync(m => m.Id == id);
            if (eBook == null)
            {
                return NotFound();
            }

            return View(eBook);
        }

        // POST: EBooks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            if (_context.EBook == null)
            {
                return Problem("Entity set 'ApplicationContext.EBook'  is null.");
            }
            var eBook = await _context.EBook.FindAsync(id);
            if (eBook != null)
            {
                _context.EBook.Remove(eBook);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EBookExists(Guid id)
        {
            return _context.EBook.Any(e => e.Id == id);
        }*/
    }
}
