/**
 * Declare all the enums as global variables.
 * Global variables declaration are restricted to this folder.
 */
function DeclareEnums()
{
    SELECTION_TYPE =
    {
        None: 0,
        SingleVertex: 1,
        SingleBend: 2,
        SingleEdge: 3,
        ConnectedBendVertex: 4,
        ConnectedBendBend: 5,
        Multiple: 6
    };

    ACTION_MODE =
    {
        None: 0,
        Insert: 1,
        Connect: 2,
        Bend: 3
    };

    RENDER_QUALITY_TYPE =
    {
        Low: 0,
        Normal: 1,
        High: 2
    };
}

DeclareEnums();