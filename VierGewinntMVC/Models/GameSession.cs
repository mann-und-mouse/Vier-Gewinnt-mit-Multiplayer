using AspNetCoreGeneratedDocument;
using Humanizer;

namespace VierGewinntMVC.Models
{
    public class GameSession
    {
        public Spieler? Spieler1 { get; set; }
        public Spieler? Spieler2 { get; set; }
        public Spieler? AktiverSpieler { get; set; }
        public Spieler? MoeglicherGewinner { get; set; }
        public int[][] GameArray { get; set; } = new int[7][];
        private int summe = 0;
        private int[,] VisitedArray = new int[7, 6];

        public GameSession()
        {
            PopulateArray();
        }
        public void ResetState()
        {
            Spieler1 = null;
            Spieler2 = null;
            AktiverSpieler = null;
            MoeglicherGewinner = null;
            GameArray = new int[7][];
            VisitedArray = new int[7, 6];
        }

        private void PopulateArray()
        {
            int len = GameArray.GetLength(0);
            for (int i = 0; i < len; i++)
            {
                int[] row = new int[6] { 0, 0, 0, 0, 0, 0 };
                GameArray[i] = row;
            }
        }

       public bool ÜberprüfeSieg(int x, int y)
        {
            HorWin(x, y);
            if (summe >= 4)
                return true;
            summe = 0;
            Array.Clear(VisitedArray, 0, VisitedArray.Length);

            VertWin(x, y);
            if (summe >= 4)
                return true;
            summe = 0;
            Array.Clear(VisitedArray, 0, VisitedArray.Length);

            DiagWinAufstieg(x, y);
            if (summe >= 4)
                return true;
            summe = 0;
            Array.Clear(VisitedArray, 0, VisitedArray.Length);

            DiagWinAbstieg(x, y);
            if (summe >= 4)
                return true;
            summe = 0;
            Array.Clear(VisitedArray, 0, VisitedArray.Length);

            return false;

        }


        void HorWin(int x, int y)
        {
            if (xCheck(x) && NotVisited(x, y) && GehörtDemSpieler(x, y))
            {
                SetzeVisitedMarke(x, y);
                HorWin(x + 1, y);
                HorWin(x - 1, y);
                summe += 1;
            }
        }

        void VertWin(int x, int y)
        {
            if (yCheck(y) && NotVisited(x, y) && GehörtDemSpieler(x, y))
            {
                SetzeVisitedMarke(x, y);
                VertWin(x, y + 1);
                VertWin(x, y - 1);
                summe += 1;
            }
        }
        void DiagWinAufstieg(int x, int y)
        {
            if (xCheck(x) && yCheck(y) && GehörtDemSpieler(x, y) && NotVisited(x, y))
            {
                SetzeVisitedMarke(x, y);
                DiagWinAufstieg(x + 1, y + 1);
                DiagWinAufstieg(x - 1, y - 1);
                summe += 1;
            }

        }

        void DiagWinAbstieg(int x, int y)
        {
            if (yCheck(y) && xCheck(x) && GehörtDemSpieler(x, y) && NotVisited(x, y))
            {
                SetzeVisitedMarke(x, y);
                DiagWinAbstieg(x + 1, y - 1);
                DiagWinAbstieg(x - 1, y + 1);
                summe += 1;
            }

        }

        static bool xCheck(int x)
        {
            if (x >= 0 && x <= 6)
                return true;
            return false;
        }

        bool yCheck(int y)
        {
            if (y >= 0 && y <= 5)
                return true;
            return false;
        }

        bool GehörtDemSpieler(int x, int y)
        {
            if (GameArray[x][y] == MoeglicherGewinner.Token)
                return true;
            return false;
        }
        bool NotVisited(int x, int y)
        {
            if (VisitedArray[x, y] == 0)
                return true;
            return false;
        }
        void SetzeVisitedMarke(int x, int y)
        {
            VisitedArray[x, y] = 1;
        }
    }
}

