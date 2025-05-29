import styles from "../../../styles/components/card.module.css";
import Image from "next/image";

export default function MemberTab({ members }) {
  return (
    <div className={styles.memberList}>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        members.map((member) => (
          <div key={member.member_id} className={styles.memberCard}>
            <div className={styles.memberImageContainer}>
              <Image
                src={member.avatar_url || '/user.png'}
                alt={member.member_name}
                width={80}
                height={80}
                className={styles.memberImage}
                priority
                onError={(e) => {
                  e.target.src = '/user.png';
                }}
              />
            </div>
            <h4>{member.member_name}</h4>
            <p>Actions: {member.actions_taken}</p>
          </div>
        ))
      )}
    </div>
  );
}