using Leap;
using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace OculusLeap
{
    /// <summary>
    /// Interaction logic for GraphViewer.xaml
    /// </summary>
    public partial class GraphViewer : Window
    {
        private bool isLeftMouseDown_;
        private bool isRightMouseDown_;
        private bool isLeapEnabled_;
        private bool isOculusEnabled_;
        private OculusRift ovr_;
        private long lastFrameID_;
        private Leap.Controller leapController_;
        private LeapHelper leapHelper_;
        private float pitch_ = 0;
        private float yaw_ = 0;

        public GraphViewer()
        {
            InitializeComponent();

            isLeftMouseDown_ = false;
            isRightMouseDown_ = false;

            isLeapEnabled_ = false;
            isOculusEnabled_ = false;
            ovr_ = null;
            lastFrameID_ = -1;
            leapController_ = null;
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            WindowState = System.Windows.WindowState.Maximized;

            WebBrowser1.LoadCompleted += WebBrowser1_LoadCompleted;
            WebBrowser1.Navigate("http://127.0.0.1/client/index.html?isKeyboardEnabled=false");
        }

        void WebBrowser1_LoadCompleted(object sender,
            System.Windows.Navigation.NavigationEventArgs e)
        {
            WebBrowser1.LoadCompleted -= WebBrowser1_LoadCompleted;
            MessageBox.Show("Welcome");
            this.Dispatcher.Invoke((Action)(() =>
            {
                var dispatcherTimer = new DispatcherTimer();
                dispatcherTimer.Interval = TimeSpan.FromMilliseconds(20);
                dispatcherTimer.Tick += dispatcherTimer_Tick;
                dispatcherTimer.Start();
            }));
        }

        public void EnableOculusRift()
        {
            ovr_ = new OculusRift();
            ovr_.PredictionDelta = 0.02f;
            isOculusEnabled_ = true;
        }

        public void EnableLeapMotion(float leapOffsetX,
            float leapOffsetY, float leapOffsetZ)
        {
            leapController_ = new Leap.Controller();
            leapHelper_ = new LeapHelper(leapOffsetX, leapOffsetY, leapOffsetZ);
            isLeapEnabled_ = true;
        }

        void dispatcherTimer_Tick(object sender, EventArgs e)
        {
            if (isLeapEnabled_)
            {
                Leap.Frame frame = leapController_.Frame();
                if (frame.Id == lastFrameID_)
                    return;
                lastFrameID_ = frame.Id;

                Leap.Vector downVector = new Leap.Vector(0, -1, 0);
                Leap.Vector upVector = new Leap.Vector(0, 1, 0);

                if (Keyboard.IsKeyDown(Key.Z))
                {
                    isLeftMouseDown_ = true;
                    doLeftMouseDown();
                }
                else if (isLeftMouseDown_)
                {
                    isLeftMouseDown_ = false;
                    doLeftMouseUp();
                }

                if (Keyboard.IsKeyDown(Key.C))
                {
                    isRightMouseDown_ = true;
                    doRightMouseDown();
                }
                else if (isRightMouseDown_)
                {
                    isRightMouseDown_ = false;
                    doRightMouseUp();
                }

                if (frame.Hands.Count == 1)
                {
                    var hand = frame.Hands[0];
                    var extendedFingers = hand.Fingers.Extended();

                    if (Keyboard.IsKeyDown(Key.B) ||
                        Keyboard.IsKeyDown(Key.N) || Keyboard.IsKeyDown(Key.M))
                    {
                        if (extendedFingers.Count == 5)
                        {
                            var normal = hand.PalmNormal;
                            var rev = new Leap.Vector(-normal.x, -normal.y, normal.z);
                            var quaternion = leapHelper_.QuatrnionBetweenTwoVectors(upVector, rev);

                            var parameters = new object[] 
                            { 
                                "ACTION_MANAGER",
                                "ChangeCameraQuaternion",
                                quaternion.X,
                                quaternion.Y,
                                quaternion.Z,
                                quaternion.W
                            };

                            WebBrowser1.InvokeScript("CallMethodOnObject", parameters);
                        }

                        if (Keyboard.IsKeyDown(Key.B))
                        {
                            WebBrowser1.InvokeScript("CallMethodOnObject",
                                new object[] { "ACTION_MANAGER", "MoveCameraForward", -5 });
                        }

                        if (Keyboard.IsKeyDown(Key.M))
                        {
                            WebBrowser1.InvokeScript("CallMethodOnObject",
                                new object[] { "ACTION_MANAGER", "MoveCameraForward", 5 });
                        }
                    }

                    if (extendedFingers.Count == 1)
                    {
                        int x, y;

                        var finger = extendedFingers[0];

                        var position = finger.StabilizedTipPosition;

                        if (!leapHelper_.GetTargetPoint(
                            position, finger.Direction, out x, out y))
                            return;

                        movePointer(x, y);
                    }
                }

                if (isOculusEnabled_)
                {
                    Quaternion quaternion = ovr_.PredictedOrientation;

                    var parameters = new object[] 
                    { 
                        "ACTION_MANAGER",
                        "ChangeCameraQuaternion",
                        quaternion.X,
                        quaternion.Y,
                        quaternion.Z,
                        quaternion.W
                    };

                    WebBrowser1.InvokeScript("CallMethodOnObject", parameters);

                }
            }
        }

        private void Window_Closing(object sender,
            System.ComponentModel.CancelEventArgs e)
        {
            isLeapEnabled_ = false;
            isOculusEnabled_ = false;
            if (ovr_ != null)
                ovr_.Dispose();
            if (leapController_ != null)
                leapController_.Dispose();
        }

        public void movePointer(int x, int y)
        {
            SetCursorPos(x + (int)this.Left, y);
        }

        [DllImport("User32.dll")]
        private static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll", CharSet = CharSet.Auto,
            CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(int dwFlags, int dx, int dy,
            int cButtons, int dwExtraInfo);

        private const int MOUSEEVENTF_LEFTDOWN = 0x02;
        private const int MOUSEEVENTF_LEFTUP = 0x04;
        private const int MOUSEEVENTF_RIGHTDOWN = 0x08;
        private const int MOUSEEVENTF_RIGHTUP = 0x10;
        private const int MOUSEEVENTF_WHEEL = 0x800;

        private void doLeftMouseDown()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_LEFTDOWN, X, Y, 0, 0);
        }

        private void doLeftMouseUp()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_LEFTUP, X, Y, 0, 0);
        }

        private void doRightMouseDown()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_RIGHTDOWN, X, Y, 0, 0);
        }

        private void doRightMouseUp()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_RIGHTUP, X, Y, 0, 0);
        }

        private void doWeelUp()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_WHEEL, X, Y, 120, 0);
        }

        private void doWeelDown()
        {
            Win32Point w32Mouse = new Win32Point();
            GetCursorPos(ref w32Mouse);
            int X = w32Mouse.X;
            int Y = w32Mouse.Y;
            mouse_event(MOUSEEVENTF_WHEEL, X, Y, -120, 0);
        }

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool GetCursorPos(ref Win32Point pt);

        [StructLayout(LayoutKind.Sequential)]
        internal struct Win32Point
        {
            public Int32 X;
            public Int32 Y;
        };
    }
}
