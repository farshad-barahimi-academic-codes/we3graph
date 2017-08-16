/**
 * Creates all singletons as global variables.
 * Global variables declaration are restricted to this folder.
 */
function DeclareSingletons()
{
    /** The array holding all render engines loaded
     *  @type {RenderEngine[]} */
    RENDER_ENGINES = [];

    /** The only instance of {@link Graph}
     * @type {(Graph|null)} */
    GRAPH = null;

    /** The only instance of {@link RenderManager}
     * @type {(RenderManager|null)} */
    RENDER_MANAGER = null;

    /** The only instance of {@link BorderManager}
     * @type {(BorderManager|null)} */
    BORDER_MANAGER = null;

    /** The only instance of {@link InterfaceManager}
     * @type {(InterfaceManager|null)} */
    INTERFACE_MANAGER = null;

    /** The only instance of {@link AccordionManager}
     * @type {(AccordionManager|null)} */
    ACCORDION_MANAGER = null;

    /** The only instance of {@link ActionManager}
     * @type {(ActionManager|null)} */
    ACTION_MANAGER = null;

    /** The only instance of {@link StartPanelManager}
     * @type {(StartPanelManager|null)} */
    START_PANEL_MANAGER = null;

    /** The only instance of {@link AdminPanelManager}
     * @type {(AdminPanelManager|null)} */
    ADMIN_PANEL_MANAGER = null;

    /** The only instance of {@link WEB_SERVICE}
     * @type {(WEB_SERVICE|null)} */
    WEB_SERVICE = null;

    /** The only instance of {@link KeyboardManager}
     * @type {(KeyboardManager|null)} */
    KEYBOARD_MANAGER = null;
}

DeclareSingletons();