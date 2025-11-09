import { useEffect } from 'react';
import OverlayScrollbars from 'overlayscrollbars';

const config = {};

const useScrollbar = (root: any | null, hasScroll: boolean) => {
    
    useEffect(() => {
        let scrollbars: OverlayScrollbars | null = null;

        if (root.current && hasScroll) {
            scrollbars = OverlayScrollbars(root.current, config);
        }

        return () => {
            if (scrollbars) {
                scrollbars.destroy();
            }
        };
    }, [root, hasScroll]);
};

export { useScrollbar };
