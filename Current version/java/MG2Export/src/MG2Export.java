import We3Graph.*;

import javax.swing.*;
import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * Exports a graph to mg2 file format used by Gluskap
 */
public class MG2Export
{
    private static SystemManager systemManager_;

    public static void main(String[] args)
    {
        String serviceURL = "http://127.0.0.1/server-rest-api/v1/";
        systemManager_ = new SystemManager(serviceURL);
        systemManager_.Login("test", "testing123");

        Integer graphID = GetGraphID();
        if (graphID == null)
            return;

        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION)
        {
            File file = fileChooser.getSelectedFile();
            Export(graphID, file);
        }
    }

    /**
     * Exports the graph to specified file
     *
     * @param graphID The ID of the graph to be exported
     * @param file    The File object to export to
     */
    public static void Export(int graphID, File file)
    {
        PrintWriter printWriter;

        try
        {
            if (!file.exists())
                file.createNewFile();
            printWriter = new PrintWriter(file);
        } catch (Exception e)
        {
            JOptionPane.showMessageDialog(null, "Error in opening the file",
                    "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        printWriter.println("fileformat id MG2 version 1");

        Graph graph = systemManager_.StartGraph(graphID);
        ArrayList<Vertex> vertices = graph.GetVertices();
        for (Vertex vertex : vertices)
        {
            String line = String.format("vert id %d pos %f %f %f rgb 1.0 1.0 1.0",
                    vertex.GetIndex(), vertex.GetPosition().GetX(),
                    vertex.GetPosition().GetY(), vertex.GetPosition().GetZ());
            printWriter.println(line);
        }

        ArrayList<Edge> edges = new ArrayList<Edge>();

        for (Vertex vertex : vertices)
            for (Edge edge : vertex.GetEdges())
                if (edge.GetStartVertex().GetFullID().equals(vertex.GetFullID()))
                {
                    edges.add(edge);
                    int index = 0;
                    for (Bend bend : edge.GetBends())
                    {
                        String line = String.format(
                                "dummy id %s pos %f %f %f rgb 1.0 1.0 1.0",
                                edge.GetFullID().ToString() + "-" + index,
                                bend.GetPosition().GetX(),
                                bend.GetPosition().GetY(),
                                bend.GetPosition().GetZ());
                        printWriter.println(line);
                        index++;
                    }
                }

        for (Edge edge : edges)
        {
            ArrayList<Bend> bends = edge.GetBends();

            String line = "edge ";
            if (bends.size() != 0)
                line = "super ";
            line += String.format("src %d tgt %d radius 1.0 rgb 1.0 1.0 1.0",
                    edge.GetStartVertex().GetIndex(), edge.GetEndVertex().GetIndex());
            if (bends.size() != 0)
            {
                line += " bend " + bends.size();
                for (int index = 0; index < bends.size(); index++)
                    line += " " + edge.GetFullID().ToString() + "-" + index;
            }
            printWriter.println(line);
        }

        graph.Finish();
        printWriter.close();

    }

    /**
     * Allows the user to select a graph
     *
     * @return The ID of the selected graph
     */
    public static Integer GetGraphID()
    {
        ArrayList<Folder> folders = systemManager_.GetFolders();

        Object[] folderObjects = folders.toArray();
        Folder folder = (Folder) JOptionPane.showInputDialog(
                null, "Please select the folder", "Folder",
                JOptionPane.PLAIN_MESSAGE, null,
                folderObjects, folderObjects[0]);
        if (folder == null)
            return null;
        ArrayList<GraphInfo> graphInfos = folder.GetChildren();
        Object[] graphInfoObjects = graphInfos.toArray();
        GraphInfo graphInfo = (GraphInfo) JOptionPane.showInputDialog(
                null, "Please select the graph", "Graph",
                JOptionPane.PLAIN_MESSAGE, null,
                graphInfoObjects, graphInfoObjects[0]);

        if (graphInfo != null)
            return graphInfo.GetID();
        return null;
    }
}