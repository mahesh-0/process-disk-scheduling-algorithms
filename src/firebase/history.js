import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const HISTORY_COLLECTION = "simulationHistory";

const toPlainDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
};

export async function saveSimulationHistory({
  userId,
  simulationType,
  algorithm,
  inputData,
  results,
  metrics,
}) {
  if (!userId || !simulationType || !algorithm) return;

  await addDoc(collection(db, HISTORY_COLLECTION), {
    userId,
    simulation_type: simulationType,
    algorithm,
    input_data: inputData || null,
    results: results || null,
    metrics: metrics || null,
    createdAt: serverTimestamp(),
  });
}

export async function fetchSimulationHistory(userId) {
  if (!userId) return [];

  const historyQuery = query(
    collection(db, HISTORY_COLLECTION),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(historyQuery);

  return snapshot.docs
    .map((entryDoc) => {
      const data = entryDoc.data();
      return {
        id: entryDoc.id,
        ...data,
        created_date: toPlainDate(data.createdAt),
      };
    })
    .sort((a, b) => {
      const aTime = a.created_date ? new Date(a.created_date).getTime() : 0;
      const bTime = b.created_date ? new Date(b.created_date).getTime() : 0;
      return bTime - aTime;
    });
}

export async function deleteSimulationHistory(id) {
  if (!id) return;
  await deleteDoc(doc(db, HISTORY_COLLECTION, id));
}
