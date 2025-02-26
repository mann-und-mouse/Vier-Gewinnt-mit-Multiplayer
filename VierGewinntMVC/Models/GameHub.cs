using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.SignalR;
using System.Configuration;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using VierGewinntMVC.Controllers;

namespace VierGewinntMVC.Models
{
    public class GameHub : Hub
    {
        private readonly GameSession _gameSession;
        
        public GameHub(GameSession gameSession)
        {
            _gameSession = gameSession;

        }

        public async override Task OnConnectedAsync()
        {
           if(_gameSession.Spieler2 == null )
            {
                _gameSession.Spieler1.UserId = Context.ConnectionId;
                await Clients.Caller.SendAsync("ReceiveUsername",_gameSession.Spieler1);
            }
           else
            {
                _gameSession.Spieler2.UserId = Context.ConnectionId;
                await Clients.Caller.SendAsync("ReceiveUsername",_gameSession.Spieler2);
                await Clients.Others.SendAsync("StartGame", _gameSession.GameArray, _gameSession.AktiverSpieler);
                await Clients.Caller.SendAsync("StartGame", _gameSession.GameArray, _gameSession.AktiverSpieler);
            }
        }
        public async override Task OnDisconnectedAsync(Exception? ex)
        {
            var id = Context.ConnectionId;
            var remainingPlayer = _gameSession.Spieler1.UserId == id ? _gameSession.Spieler2 : _gameSession.Spieler1;
            _gameSession.ResetState(remainingPlayer);
            await Clients.All.SendAsync("Disconnect", "Warte auf Spieler 2");
        }
        public async Task SendMove(string xy, string farbe)
        {
            int x = int.Parse(xy[0].ToString());
            int y = int.Parse (xy[1].ToString());
            var token = _gameSession.AktiverSpieler.Token;
            _gameSession.MoeglicherGewinner = _gameSession.AktiverSpieler;
            SwitchActivePlayer();
            await Clients.All.SendAsync("ReceiveMove", _gameSession.GameArray, _gameSession.AktiverSpieler, xy, farbe);
            _gameSession.GameArray[x][y] = token;
            if (_gameSession.ÜberprüfeSieg(x,y))
            {
                await Clients.All.SendAsync("Winner", _gameSession.MoeglicherGewinner);
            }

        }
        public async Task TargetElement(string element)
        {
            await Clients.All.SendAsync("RemoveElement", element);
        }
        private void SwitchActivePlayer()
        {
            if(_gameSession.AktiverSpieler ==_gameSession.Spieler1)
            {
                _gameSession.AktiverSpieler =_gameSession.Spieler2;
            }
            else
            {
                _gameSession.AktiverSpieler =_gameSession.Spieler1;
            }
        }
}
    }
