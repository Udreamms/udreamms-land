
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, onSnapshot, addDoc, serverTimestamp, query, where, getDocs,
  doc, deleteDoc, getDoc, setDoc, writeBatch, orderBy
} from 'firebase/firestore';
import Group from './Group';
import Card from './Card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

const KanbanBoard = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const groupIds = useMemo(() => groups.map((g) => g.id), [groups]);

  useEffect(() => {
    const groupsCollection = collection(db, 'kanban-groups');
    const unsubscribe = onSnapshot(query(groupsCollection, orderBy("createdAt", "asc")), (snapshot) => {
      const groupsFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const batch = writeBatch(db);
      let needsDataFix = false;
      groupsFromDb.forEach((group, index) => {
        if (group.order === undefined) {
          const groupRef = doc(db, 'kanban-groups', group.id);
          batch.update(groupRef, { order: index });
          needsDataFix = true;
          group.order = index;
        }
      });
      if (needsDataFix) {
        batch.commit();
      }
      groupsFromDb.sort((a, b) => a.order - b.order);
      setGroups(groupsFromDb);
    });
    const ensureInboxGroupExists = async () => {
      const inboxQuery = query(groupsCollection, where("isInbox", "==", true));
      const querySnapshot = await getDocs(inboxQuery);
      if (querySnapshot.empty) {
        const allGroupsSnapshot = await getDocs(groupsCollection);
        await addDoc(groupsCollection, {
          name: "Bandeja de Entrada", isInbox: true, createdAt: serverTimestamp(), order: allGroupsSnapshot.size
        });
      }
    };
    ensureInboxGroupExists();
    return () => unsubscribe();
  }, []);

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (newGroupName.trim() !== '') {
      await addDoc(collection(db, 'kanban-groups'), {
        name: newGroupName, order: groups.length, isInbox: false, createdAt: serverTimestamp()
      });
      setNewGroupName('');
    }
  };

  function onDragStart(event) {
    if (event.active.data.current?.type === "GROUP") setActiveGroup(event.active.data.current.group);
    if (event.active.data.current?.type === "CARD") setActiveCard(event.active.data.current.card);
  }

  async function onDragEnd(event) {
    setActiveGroup(null);
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (active.data.current?.type === "GROUP") {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      setGroups(newGroups);
      const batch = writeBatch(db);
      newGroups.forEach((group, index) => {
        batch.update(doc(db, 'kanban-groups', group.id), { order: index });
      });
      await batch.commit();
    }

    if (active.data.current?.type === "CARD") {
      // --- VERIFICACIÓN DE SEGURIDAD MEJORADA ---
      const sourceGroupId = active.data.current?.card?.groupId;
      let destGroupId = over.id; // Por defecto, el id del contenedor
      // Si soltamos sobre otra tarjeta, obtenemos el groupId de esa tarjeta
      if (over.data.current?.type === 'CARD') {
        destGroupId = over.data.current.card.groupId;
      }

      if (!sourceGroupId || !destGroupId || sourceGroupId === destGroupId) {
        return; // No hacer nada si los datos son incorrectos o si es el mismo grupo
      }

      try {
        const cardRef = doc(db, 'kanban-groups', sourceGroupId, 'cards', active.id);
        const cardSnap = await getDoc(cardRef);
        if (cardSnap.exists()) {
          await setDoc(doc(db, 'kanban-groups', destGroupId, 'cards', active.id), cardSnap.data());
          await deleteDoc(cardRef);
        }
      } catch (error) {
        console.error("Error al mover la tarjeta:", error);
      }
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex items-start h-full space-x-4 p-4 overflow-x-auto">
        <SortableContext items={groupIds}>
          {groups.map((group) => <Group key={group.id} group={group} />)}
        </SortableContext>
        <div className="w-72 flex-shrink-0">
          <form onSubmit={handleAddGroup} className="flex items-center p-2 rounded-lg bg-gray-900/50">
            <Input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="+ Nuevo grupo..." className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-grow border-none" autoComplete="off" />
            <Button variant="ghost" size="sm" type="submit"><Plus /></Button>
          </form>
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeGroup && <Group group={activeGroup} />}
          {activeCard && <Card card={activeCard} groupId={activeCard.groupId} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
