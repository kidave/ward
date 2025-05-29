import { MemberTab, ActionTab, RoadTab, OutcomeTab, JunctionTab } from './tabs';
import styles from '../../styles/layout/container.module.css';

export default function WardContent({ 
  activeTab,
  action, 
  member, 
  road,
  junction,
  outcome,
  onRoadClick
}) {
  return (
    <div className={styles.wardContent}>
      {activeTab === 'action' && <ActionTab actions={action} />}
      {activeTab === 'member' && <MemberTab members={member} />}
      {activeTab === 'road' && <RoadTab roads={road} onRoadClick={onRoadClick} />}
      {activeTab === 'outcome' && <OutcomeTab />}
      {activeTab === 'junction' && <JunctionTab />}
    </div>
  );
}