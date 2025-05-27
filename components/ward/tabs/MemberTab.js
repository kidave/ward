import buttonStyles from "../../../styles/components/button.module.css";
import styles from "../../../styles/components/card.module.css";

export default function MemberTab({ members }) {
  return (
      <div className={styles.memberList}>
        {members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          members.map((member) => (
            <div key={member.member_id} className={styles.memberCard}>
              <h4>{member.member_name}</h4>
              <p>Actions: {member.actions_taken}</p>
            </div>
          ))
        )}
      </div>
  );
}