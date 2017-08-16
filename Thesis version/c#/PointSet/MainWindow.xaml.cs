using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using We3Graph;

namespace PointSet
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private SystemManager systemManager_;
        public MainWindow()
        {
            InitializeComponent();
        }

        private List<Point3D> GetK5Points()
        {
            var points = new List<Point3D>();
            points.Add(new Point3D(1, 9, 7));
            points.Add(new Point3D(5, 3, 10));
            points.Add(new Point3D(1, 4, 2));
            points.Add(new Point3D(5, 5, 2));
            points.Add(new Point3D(9, 6, 4));
            return points;
        }

        private List<List<int>> GetK5AdjacencyList()
        {
            var adjacencyList = new List<List<int>>();
            for (int i = 0; i < 5; i++)
            {
                adjacencyList.Add(new List<int>());
                for (int j = i + 1; j < 5; j++)
                    adjacencyList[i].Add(j);
            }
            return adjacencyList;
        }



        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            string serviceURL = "http://127.0.0.1/server-rest-api/v1/";
            var testUsername_ = "test";
            var testPassword_ = "testing123";
            systemManager_ = new SystemManager(serviceURL);
            systemManager_.Login(testUsername_, testPassword_);


            List<Folder> folders = systemManager_.GetFolders();
            foreach (var folder in folders)
                FolderListBox.Items.Add(folder);
            FolderListBox.SelectedIndex = 0;
        }

        private void FirstAlgorithmStartButton_Click(object sender, RoutedEventArgs e)
        {
            FirstAlgorithmStartButton.IsEnabled = false;
            FirstAlgorithmStartButton.Content = "Please wait...";

            string graphName = GraphNameTextBox.Text;
            var folderID = (FolderListBox.SelectedItem as Folder).GetID();

            var graphID = systemManager_.CreateGraph(graphName, folderID,
                Statics.DEFAULT_ENGINE_GUID);
            var graph = systemManager_.StartGraph(graphID);

            FirstAlgorithm firstAlgorithm = new FirstAlgorithm();
            Application.Current.Dispatcher.BeginInvoke(
                DispatcherPriority.Background,
                new Action(() =>
                {
                    firstAlgorithm.Start(GetK5Points(), GetK5AdjacencyList(), graph);
                    FirstAlgorithmStartButton.Content = "Start first algorithm";
                    FirstAlgorithmStartButton.IsEnabled = true;
                }));

        }

        private void SecondAlgorithmStartButton_Click(object sender, RoutedEventArgs e)
        {
            SecondAlgorithmStartButton.IsEnabled = false;
            SecondAlgorithmStartButton.Content = "Please wait...";

            string graphName = GraphNameTextBox.Text;
            var folderID = (FolderListBox.SelectedItem as Folder).GetID();

            var graphID = systemManager_.CreateGraph(graphName, folderID,
                Statics.DEFAULT_ENGINE_GUID);
            var graph = systemManager_.StartGraph(graphID);

            SecondAlgorithm secondAlgorithm = new SecondAlgorithm();
            Application.Current.Dispatcher.BeginInvoke(
                DispatcherPriority.Background,
                new Action(() =>
                {
                    secondAlgorithm.Start(GetK5Points(), GetK5AdjacencyList(), graph);
                    SecondAlgorithmStartButton.Content = "Start second algorithm";
                    SecondAlgorithmStartButton.IsEnabled = true;
                }));



        }
    }
}
