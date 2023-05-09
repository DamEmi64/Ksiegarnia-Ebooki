using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    public partial class gift_tokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Readers_Transactions_TransactionId",
                table: "Readers");

            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Ebooks");

            migrationBuilder.AlterColumn<Guid>(
                name: "TransactionId",
                table: "Readers",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "Tokens",
                table: "Ebooks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Verification",
                table: "Ebooks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Readers_Transactions_TransactionId",
                table: "Readers",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Readers_Transactions_TransactionId",
                table: "Readers");

            migrationBuilder.DropColumn(
                name: "Tokens",
                table: "Ebooks");

            migrationBuilder.DropColumn(
                name: "Verification",
                table: "Ebooks");

            migrationBuilder.AlterColumn<Guid>(
                name: "TransactionId",
                table: "Readers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "Ebooks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Readers_Transactions_TransactionId",
                table: "Readers",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
