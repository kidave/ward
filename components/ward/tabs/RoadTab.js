import buttonStyles from '../../../styles/components/button.module.css';

export default function RoadTab({ roads, onRoadClick }) {
  return (
      <div className={buttonStyles.list}>
        {roads.length > 0 ? (
          roads.map((road) => (
            <button
              key={road.id}
              className={buttonStyles.wide}
              onClick={() => onRoadClick(road.name)}
            >
              {road.name}
            </button>
          ))
        ) : (
          <p>No roads found.</p>
        )}
      </div>
  );
}