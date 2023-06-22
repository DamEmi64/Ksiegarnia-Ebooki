using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    public partial class PremiumToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Premiums_PremiumId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_PremiumId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PremiumId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Premiums",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Premiums_UserId",
                table: "Premiums",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Premiums_AspNetUsers_UserId",
                table: "Premiums",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Premiums_AspNetUsers_UserId",
                table: "Premiums");

            migrationBuilder.DropIndex(
                name: "IX_Premiums_UserId",
                table: "Premiums");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Premiums");

            migrationBuilder.AddColumn<Guid>(
                name: "PremiumId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_PremiumId",
                table: "AspNetUsers",
                column: "PremiumId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Premiums_PremiumId",
                table: "AspNetUsers",
                column: "PremiumId",
                principalTable: "Premiums",
                principalColumn: "Id");
        }
    }
}
