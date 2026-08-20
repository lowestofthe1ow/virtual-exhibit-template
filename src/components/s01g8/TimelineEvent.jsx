export default function TimelineEvent({ event }) {

    if (!event) {
        return null;
    }

    return (
        <div>

            <img
                src={event.image}
                alt={event.imageAlt}
                style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain"
                }}
            />

            <h3>{event.year}</h3>

            <h4>{event.title}</h4>

            <p>{event.description}</p>

        </div>
    );

}