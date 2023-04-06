﻿namespace Infrastructure.Exceptions
{
    public class BookNotVerifiedException : DefaultException
    {
        public BookNotVerifiedException()
            : base()
        {
            base.Title = "Ebook not veirfied.";
            base.StatusCode = System.Net.HttpStatusCode.NotAcceptable;
        }
    }
}
