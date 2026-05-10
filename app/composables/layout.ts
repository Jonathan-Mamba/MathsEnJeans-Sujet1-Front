import { MenuEditMode } from "~/util";


export const useLayout = () => {
    const editMode = useState<MenuEditMode>("edit-mode", () => MenuEditMode.SQUARE)
    const tabletLayoutThreshold = 800;

    return { editMode, tabletLayoutThreshold };
}