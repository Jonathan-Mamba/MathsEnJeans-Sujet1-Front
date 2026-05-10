import { MenuEditMode } from "~/util";


export const useLayout = () => {
    const editMode = useState<MenuEditMode>("edit-mode", () => MenuEditMode.SQUARE)
    const tabletLayoutThreshold = 800;
    const mobileLayoutThreshold = 480;

    const isMobileLayout = computed(() => {
        return window.innerWidth < mobileLayoutThreshold;
    });
    const isTabletLayout = computed(() => {
        return window.innerWidth >= mobileLayoutThreshold && window.innerWidth < tabletLayoutThreshold;
    });
    const isDesktopLayout = computed(() => {
        return window.innerWidth >= tabletLayoutThreshold;
    });

    return { editMode, isMobileLayout, isTabletLayout, tabletLayoutThreshold, mobileLayoutThreshold, isDesktopLayout };
}