/**
 * RouterMarker
 * Status bar beneath the canvas showing the router's current position.
 */
export default function RouterMarker({ router }) {
    return (
        <div className="flex items-start sm:items-center gap-2 text-xs px-1 min-h-9 py-1 leading-relaxed">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 mt-1 sm:mt-0" />
            <span className="text-s01g6-muted-foreground">
                Router at ({router.x}, {router.y}); drag it to move
            </span>
        </div>
    );
}
