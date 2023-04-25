using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    public partial class porzadki : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Premiums");

            migrationBuilder.AddColumn<int>(
                name: "DaysToFinishPremium",
                table: "Premiums",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "HideInfoId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Distinction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BookId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HowLong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Distinction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Distinction_Ebooks_BookId",
                        column: x => x.BookId,
                        principalTable: "Ebooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HideInfo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<bool>(type: "bit", nullable: false),
                    Email = table.Column<bool>(type: "bit", nullable: false),
                    LastName = table.Column<bool>(type: "bit", nullable: false),
                    Phone = table.Column<bool>(type: "bit", nullable: false),
                    Age = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HideInfo", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HideInfoId",
                table: "AspNetUsers",
                column: "HideInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Distinction_BookId",
                table: "Distinction",
                column: "BookId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_HideInfo_HideInfoId",
                table: "AspNetUsers",
                column: "HideInfoId",
                principalTable: "HideInfo",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_HideInfo_HideInfoId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Distinction");

            migrationBuilder.DropTable(
                name: "HideInfo");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HideInfoId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DaysToFinishPremium",
                table: "Premiums");

            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HideInfoId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Premiums",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
