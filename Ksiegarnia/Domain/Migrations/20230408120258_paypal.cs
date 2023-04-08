using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    public partial class paypal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Readers_TransactionId",
                table: "Readers");

            migrationBuilder.AddColumn<bool>(
                name: "Finished",
                table: "Transactions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Readers_TransactionId",
                table: "Readers",
                column: "TransactionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Readers_TransactionId",
                table: "Readers");

            migrationBuilder.DropColumn(
                name: "Finished",
                table: "Transactions");

            migrationBuilder.CreateIndex(
                name: "IX_Readers_TransactionId",
                table: "Readers",
                column: "TransactionId",
                unique: true);
        }
    }
}
