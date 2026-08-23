import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import AdminLoginView from '@/views/admin/AdminLoginView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminProfileView from '@/views/admin/AdminProfileView.vue'
import AdminSocialsView from '@/views/admin/AdminSocialsView.vue'
import AdminExperienceView from '@/views/admin/AdminExperienceView.vue'
import AdminSkillsView from '@/views/admin/AdminSkillsView.vue'
import AdminProjectsView from '@/views/admin/AdminProjectsView.vue'
import AdminProjectFormView from '@/views/admin/AdminProjectFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'projects/:slug',
          name: 'project-detail',
          component: ProjectDetailView,
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: AdminDashboardView,
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: AdminProfileView,
        },
        {
          path: 'socials',
          name: 'admin-socials',
          component: AdminSocialsView,
        },
        {
          path: 'experience',
          name: 'admin-experience',
          component: AdminExperienceView,
        },
        {
          path: 'skills',
          name: 'admin-skills',
          component: AdminSkillsView,
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: AdminProjectsView,
        },
        {
          path: 'projects/new',
          name: 'admin-project-new',
          component: AdminProjectFormView,
        },
        {
          path: 'projects/:id',
          name: 'admin-project-edit',
          component: AdminProjectFormView,
        },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
