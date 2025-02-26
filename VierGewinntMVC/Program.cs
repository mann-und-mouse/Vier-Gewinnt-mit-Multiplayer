using VierGewinntMVC.Controllers;
using VierGewinntMVC.Models;

namespace VierGewinntMVC
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration.GetConnectionString("SignalR"));
            builder.Services.AddSingleton<GameSession>();
            builder.Services.AddSingleton<HomeController>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapHub<GameHub>("/gameHub");

            app.Run();
        }
    }
}
