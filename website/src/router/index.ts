import { createRouter, createWebHistory } from "vue-router";
import ModuleSelectionView from "../views/ModuleSelectionView.vue";
import SemesterOrganizationView from "../views/SemesterOrganizationView.vue";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'ModuleSelection',
            component: ModuleSelectionView
        },
        {
            path: '/semesterOrganizer/',
            name: 'SemesterOrganizer',
            component: SemesterOrganizationView
        }
    ]
});