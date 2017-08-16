import We3Graph.*;

import javax.swing.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Hashtable;

/**
 * Imports a graph from mg2 file format used by Gluskap
 */
public class MG2Import
{
    private static SystemManager systemManager_;

    public static void main(String[] args)
    {
        String serviceURL = "http://127.0.0.1/server-rest-api/v1/";
        systemManager_ = new SystemManager(serviceURL);
        systemManager_.Login("test", "testing123");

        Integer folderID = GetFolderID();
        if (folderID == null)
            return;

        String graphName = JOptionPane.showInputDialog(
                null, "Please specify the new graph name", "Graph name",
                JOptionPane.PLAIN_MESSAGE);

        int graphID = systemManager_.CreateGraph(graphName, folderID,
                Statics.DEFAULT_ENGINE_GUID);

        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showOpenDialog(null) == JFileChooser.APPROVE_OPTION)
        {
            File file = fileChooser.getSelectedFile();
            Import(graphID, file);
        }
    }

    /**
     * Imports the graph from the specified file
     *
     * @param graphID The ID of the graph to be exported
     * @param file    The File object to import from
     */
    public static void Import(int graphID, File file)
    {
        BufferedReader bufferedReader = null;

        Hashtable<String, Vertex> idToVertex = new Hashtable<String, Vertex>();
        Hashtable<String, Point3D> idToBendPos = new Hashtable<String, Point3D>();

        Graph graph = systemManager_.StartGraph(graphID);

        try
        {
            bufferedReader = new BufferedReader(new FileReader(file));
            String line = null;
            while ((line = bufferedReader.readLine()) != null)
            {
                String[] lineParts = line.split(" ");
                if (line.startsWith("vert") || line.startsWith("dummy"))
                {
                    String id = "";
                    double x = 0, y = 0, z = 0;
                    for (int i = 0; i < lineParts.length; i++)
                    {
                        if (lineParts[i].equals("id"))
                            id = lineParts[i + 1];
                        if (lineParts[i].equals("pos"))
                        {
                            x = Double.parseDouble(lineParts[i + 1]);
                            y = Double.parseDouble(lineParts[i + 2]);
                            z = Double.parseDouble(lineParts[i + 3]);
                        }
                    }

                    if (line.startsWith("vert"))
                    {
                        Vertex vertex = graph.AddVertex(new Point3D(x, y, z));
                        idToVertex.put(id, vertex);
                    } else
                    {
                        idToBendPos.put(id, new Point3D(x, y, z));
                    }
                } else if (line.startsWith("edge") || line.startsWith("super"))
                {
                    String source = "", target = "";
                    int bendIndex = 0;
                    for (int i = 0; i < lineParts.length; i++)
                    {
                        if (lineParts[i].equals("src"))
                            source = lineParts[i + 1];
                        if (lineParts[i].equals("tgt"))
                            target = lineParts[i + 1];
                        if (lineParts[i].equals("bend"))
                            bendIndex = i;
                    }
                    Vertex startVertex = idToVertex.get(source);
                    Vertex endVertex = idToVertex.get(target);
                    Edge edge = startVertex.ConnectTo(endVertex);

                    if (line.startsWith("super"))
                    {
                        int bendCount = Integer.parseInt(lineParts[bendIndex + 1]);
                        for (int i = 0; i < bendCount; i++)
                        {
                            Point3D position = idToBendPos.get(
                                    lineParts[bendIndex + 2 + i]);
                            edge.BreakEdgeLine(position, i);
                        }
                    }
                }
            }

            bufferedReader.close();
        } catch (Exception e)
        {
            JOptionPane.showMessageDialog(null, "Error in reading the file",
                    "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        graph.Finish();
    }

    /**
     * Allows the user to select a folder
     *
     * @return The ID of the selected folder
     */
    public static Integer GetFolderID()
    {
        ArrayList<Folder> folders = systemManager_.GetFolders();

        Object[] folderObjects = folders.toArray();
        Folder folder = (Folder) JOptionPane.showInputDialog(
                null, "Please select the folder", "Folder",
                JOptionPane.PLAIN_MESSAGE, null,
                folderObjects, folderObjects[0]);
        if (folder == null)
            return null;
        else
            return folder.GetID();
    }
}