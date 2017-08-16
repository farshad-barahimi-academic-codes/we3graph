using Microsoft.Win32;
using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace OculusLeap
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private GraphViewer graphViewer_;
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            var exeName = System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName;
            exeName = System.IO.Path.GetFileName(exeName);

            // Setup registry value for IE11 engine
            var key = "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION";
            var value = 11001;
            Registry.SetValue(key, exeName, value, RegistryValueKind.DWord);

            // Setup registry value for GPU rendering
            key = "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_GPU_RENDERING";
            value = 1;
            Registry.SetValue(key, exeName, value, RegistryValueKind.DWord);

            var screens = Screen.AllScreens;
            foreach (var screen in screens)
                ScreenComboBox.Items.Add(screen.DeviceName);
            ScreenComboBox.SelectedIndex = 0;
        }

        private void ShowButton_Click(object sender, RoutedEventArgs e)
        {

            graphViewer_ = new GraphViewer();

            Screen screen = Screen.AllScreens[ScreenComboBox.SelectedIndex];
            System.Drawing.Rectangle rect = screen.WorkingArea;
            graphViewer_.Top = rect.Top;
            graphViewer_.Left = rect.Left;
            graphViewer_.Width = rect.Width;
            graphViewer_.Height = rect.Height;
            ShowButton.IsEnabled = false;
            graphViewer_.Show();

            if (IsOculusEnabledRadioButton.IsChecked.Value)
            {
                graphViewer_.WindowState = System.Windows.WindowState.Normal;
                graphViewer_.WindowStyle = System.Windows.WindowStyle.None;
                graphViewer_.WindowState = System.Windows.WindowState.Maximized;
                graphViewer_.ResizeMode = System.Windows.ResizeMode.NoResize;

                graphViewer_.EnableOculusRift();
            }

            if (IsLeapEnabledRadioButton.IsChecked.Value)
            {
                var xoffset = float.Parse(XOffsetTextbox.Text);
                var yoffset = float.Parse(YOffsetTextbox.Text);
                var zoffset = float.Parse(ZOffsetTextbox.Text);

                graphViewer_.EnableLeapMotion(xoffset, yoffset, zoffset);
            }
        }

        private void Window_Closing(object sender,
            System.ComponentModel.CancelEventArgs e)
        {

        }
    }
}
