using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Text.Json;
using VierGewinntMVC.Models;

namespace VierGewinntMVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly GameSession _gameSession;
        private readonly IHubContext<GameHub> _gameHub;

        public HomeController(GameSession gameSession, IHubContext<GameHub> hubContext)
        {
            _gameSession = gameSession;
            _gameHub = hubContext;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Game()
        {
            return View();
        }
        public async Task<IActionResult> AddPlayer(string username)
        {
            string message = "Warte auf Spieler 2";
            if (_gameSession.Spieler1 == null)
            {
                _gameSession.Spieler1 = new Spieler()
                {
                    Name = username,
                    Farbe = "red",
                    Token = 1
                };
                _gameSession.AktiverSpieler = _gameSession.Spieler1;
                ViewData["Waiting"] = message;
            }
            else if (_gameSession.Spieler2 == null)
            {
                _gameSession.Spieler2 = new Spieler()
                {
                    Name = username,
                    Farbe = "yellow",
                    Token = 2
                };
            }
            return View("Game");
        }

       
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
