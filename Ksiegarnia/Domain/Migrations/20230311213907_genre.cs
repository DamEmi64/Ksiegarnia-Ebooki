using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    public partial class genre : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Genre",
                table: "Ebooks",
                newName: "PageNumber");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Ebooks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "GenreId",
                table: "Ebooks",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genre", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ebooks_GenreId",
                table: "Ebooks",
                column: "GenreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ebooks_Genre_GenreId",
                table: "Ebooks",
                column: "GenreId",
                principalTable: "Genre",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ebooks_Genre_GenreId",
                table: "Ebooks");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.DropIndex(
                name: "IX_Ebooks_GenreId",
                table: "Ebooks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Ebooks");

            migrationBuilder.DropColumn(
                name: "GenreId",
                table: "Ebooks");

            migrationBuilder.RenameColumn(
                name: "PageNumber",
                table: "Ebooks",
                newName: "Genre");
        }
    }
}
