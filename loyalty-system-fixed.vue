<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <div class="max-w-md w-full space-y-8 p-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white mb-2">LoyaltyPro</h1>
          <p class="text-purple-100">Choose your login type</p>
        </div>

        <!-- Login Type Selector -->
        <div class="flex justify-center space-x-4 mb-8">
          <button
            v-for="type in loginTypes"
            :key="type.id"
            @click="selectedLoginType = type.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedLoginType === type.id
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-purple-500 text-white hover:bg-purple-400'
            ]"
          >
            {{ type.name }}
          </button>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-lg shadow-xl p-8">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg v-if="selectedLoginType === 'consumer'" class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <svg v-else-if="selectedLoginType === 'partner'" class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <svg v-else class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ getLoginTypeInfo.name }} Login
            </h2>
            <p class="text-gray-600 mt-2">
              {{ getLoginTypeInfo.description }}
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ selectedLoginType === 'consumer' ? 'Email or Phone' : 'Email' }}
              </label>
              <input
                v-model="loginForm.email"
                :type="selectedLoginType === 'consumer' ? 'text' : 'email'"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                :placeholder="selectedLoginType === 'consumer' ? 'Enter email or phone' : 'Enter your email'"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div class="relative">
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your password"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Organization Code for Partners -->
            <div v-if="selectedLoginType === 'partner'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization Code</label>
              <input
                v-model="loginForm.organizationCode"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter organization code"
              >
            </div>

            <!-- Admin Access Code -->
            <div v-if="selectedLoginType === 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Admin Access Code</label>
              <input
                v-model="loginForm.accessCode"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter admin access code"
              >
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <button type="button" class="text-sm text-purple-600 hover:text-purple-500">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <!-- Registration Link for Consumers -->
          <div v-if="selectedLoginType === 'consumer'" class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <button @click="showRegistration = true" class="text-purple-600 hover:text-purple-500 font-medium">
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegistration" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Create Consumer Account</h3>
          <button @click="showRegistration = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleRegistration" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-model="registrationForm.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                v-model="registrationForm.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="registrationForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="registrationForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              v-model="registrationForm.dateOfBirth"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              v-model="registrationForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              v-model="registrationForm.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div class="flex items-center">
            <input
              v-model="registrationForm.agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-purple-600 hover:text-purple-500">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>

    <!-- Main Application -->
    <div v-if="isAuthenticated">
      <!-- Consumer Dashboard -->
      <div v-if="currentUser.role === 'consumer'">
        <ConsumerDashboard :user="currentUser" @logout="handleLogout" />
      </div>
      
      <!-- Partner Dashboard -->
      <div v-if="currentUser.role === 'partner'">
        <PartnerDashboard :user="currentUser" @logout="handleLogout" />
      </div>
      
      <!-- Admin Dashboard -->
      <div v-if="currentUser.role === 'admin'">
        <AdminDashboard :user="currentUser" @logout="handleLogout" />
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive data
const isAuthenticated = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const showRegistration = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const selectedLoginType = ref('consumer')
const currentUser = ref(null)

const loginTypes = ref([
  {
    id: 'consumer',
    name: 'Consumer',
    description: 'Access your loyalty rewards and points'
  },
  {
    id: 'partner',
    name: 'Partner',
    description: 'Manage your business loyalty program'
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'System administration and management'
  }
])

const loginForm = ref({
  email: '',
  password: '',
  organizationCode: '',
  accessCode: '',
  rememberMe: false
})

const registrationForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// Computed properties
const getLoginTypeInfo = computed(() => {
  return loginTypes.value.find(t => t.id === selectedLoginType.value) || loginTypes.value[0]
})

// Consumer Dashboard Component
const ConsumerDashboard = {
  props: ['user'],
  emits: ['logout'],
  setup(props, { emit }) {
    const activeTab = ref('dashboard')
    const tabs = ref([
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'rewards', name: 'Rewards' },
      { id: 'profile', name: 'Profile' }
    ])

    const rewards = ref([
      {
        id: 1,
        name: '10% Off Coupon',
        description: 'Get 10% off your next purchase',
        points: 500
      },
      {
        id: 2,
        name: 'Free Coffee',
        description: 'Enjoy a complimentary coffee',
        points: 200
      },
      {
        id: 3,
        name: 'VIP Event Access',
        description: 'Exclusive access to VIP events',
        points: 2000
      }
    ])

    return {
      activeTab,
      tabs,
      rewards
    }
  },
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-purple-600">LoyaltyPro</h1>
              <div class="hidden md:block ml-10">
                <div class="flex items-baseline space-x-4">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-sm">{{ user.name.charAt(0) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
              </div>
              <button @click="$emit('logout')" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Points</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ user.points.toLocaleString() }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tier Status</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ user.tier }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Rewards Earned</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ user.rewardsEarned }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Next Tier</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ user.nextTier }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Digital Loyalty Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Digital Loyalty Card</h3>
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="text-xl font-bold">{{ user.name }}</h4>
                  <p class="text-purple-100">{{ user.tier }} Member</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold">{{ user.points.toLocaleString() }}</p>
                  <p class="text-purple-100">Points</p>
                </div>
              </div>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-purple-100 text-sm">Member Since</p>
                  <p class="font-semibold">{{ user.memberSince }}</p>
                </div>
                <div class="text-right">
                  <p class="text-purple-100 text-sm">Card Number</p>
                  <p class="font-mono">{{ user.cardNumber }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rewards Tab -->
        <div v-if="activeTab === 'rewards'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">Available Rewards</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="reward in rewards" :key="reward.id" class="bg-white rounded-lg shadow overflow-hidden">
              <div class="h-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ reward.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ reward.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-purple-600">{{ reward.points.toLocaleString() }} pts</span>
                  <button
                    :disabled="user.points < reward.points"
                    :class="[
                      'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      user.points >= reward.points
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                  >
                    {{ user.points >= reward.points ? 'Redeem' : 'Insufficient Points' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <div class="bg-white rounded-lg shadow p-6">
            <form class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    :value="user.name.split(' ')[0]"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    :value="user.name.split(' ')[1] || ''"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  :value="user.email"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
              </div>
              <button
                type="submit"
                class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  `
}

// Partner Dashboard Component
const PartnerDashboard = {
  props: ['user'],
  emits: ['logout'],
  setup(props, { emit }) {
    const activeTab = ref('dashboard')
    const customerSearch = ref('')
    
    const tabs = ref([
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'customers', name: 'Customers' },
      { id: 'rewards', name: 'Rewards' },
      { id: 'reports', name: 'Reports' }
    ])

    const partnerStats = ref({
      totalCustomers: 1250,
      pointsIssued: 125000,
      rewardsRedeemed: 450,
      revenueImpact: 25000
    })

    const customers = ref([
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        points: 2500,
        tier: 'Gold',
        lastVisit: '2024-01-15'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        points: 1500,
        tier: 'Silver',
        lastVisit: '2024-01-14'
      }
    ])

    const partnerRewards = ref([
      {
        id: 1,
        name: '10% Store Discount',
        description: 'Get 10% off any purchase',
        points: 500,
        redeemed: 125
      },
      {
        id: 2,
        name: 'Free Product Sample',
        description: 'Try our new product for free',
        points: 200,
        redeemed: 89
      }
    ])

    const filteredCustomers = computed(() => {
      if (!customerSearch.value) return customers.value
      return customers.value.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.value.toLowerCase())
      )
    })

    return {
      activeTab,
      customerSearch,
      tabs,
      partnerStats,
      customers,
      partnerRewards,
      filteredCustomers
    }
  },
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-purple-600">LoyaltyPro Partner</h1>
              <div class="hidden md:block ml-10">
                <div class="flex items-baseline space-x-4">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-sm">{{ user.organization.charAt(0) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ user.organization }}</span>
              </div>
              <button @click="$emit('logout')" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Total Customers</h3>
              <p class="text-2xl font-bold text-gray-900">{{ partnerStats.totalCustomers.toLocaleString() }}</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Points Issued</h3>
              <p class="text-2xl font-bold text-gray-900">{{ partnerStats.pointsIssued.toLocaleString() }}</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Rewards Redeemed</h3>
              <p class="text-2xl font-bold text-gray-900">{{ partnerStats.rewardsRedeemed.toLocaleString() }}</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Revenue Impact</h3>
              <p class="text-2xl font-bold text-gray-900">\${{ partnerStats.revenueImpact.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Issue Points
              </button>
              <button class="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Validate Redemption
              </button>
              <button class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View Reports
              </button>
            </div>
          </div>
        </div>

        <!-- Customers Tab -->
        <div v-if="activeTab === 'customers'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Customer Management</h2>
            <input
              v-model="customerSearch"
              type="text"
              placeholder="Search customers..."
              class="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
            >
          </div>

          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="customer in filteredCustomers" :key="customer.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span class="text-purple-600 font-semibold text-sm">{{ customer.name.charAt(0) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                        <div class="text-sm text-gray-500">{{ customer.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.points.toLocaleString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.tier }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.lastVisit }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-purple-600 hover:text-purple-900 mr-3">Issue Points</button>
                    <button class="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Rewards Tab -->
        <div v-if="activeTab === 'rewards'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Reward Management</h2>
            <button class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Create Reward
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="reward in partnerRewards" :key="reward.id" class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ reward.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ reward.description }}</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-bold text-purple-600">{{ reward.points.toLocaleString() }} pts</span>
                <span class="text-sm text-gray-500">{{ reward.redeemed }} redeemed</span>
              </div>
              <div class="flex space-x-2">
                <button class="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm hover:bg-purple-700 transition-colors">
                  Edit
                </button>
                <button class="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-400 transition-colors">
                  Disable
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
}

// Admin Dashboard Component
const AdminDashboard = {
  props: ['user'],
  emits: ['logout'],
  setup(props, { emit }) {
    const activeTab = ref('overview')
    const memberSearch = ref('')
    
    const tabs = ref([
      { id: 'overview', name: 'Overview' },
      { id: 'members', name: 'Members' },
      { id: 'partners', name: 'Partners' },
      { id: 'settings', name: 'Settings' }
    ])

    const adminStats = ref({
      totalMembers: 15420,
      activePartners: 89,
      pointsCirculating: 2450000,
      systemRevenue: 125000
    })

    const recentActivity = ref([
      {
        id: 1,
        type: 'member',
        description: 'New member registration: Alice Johnson',
        timestamp: '2 minutes ago'
      },
      {
        id: 2,
        type: 'partner',
        description: 'Partner "Coffee Shop Co" issued 500 points',
        timestamp: '15 minutes ago'
      },
      {
        id: 3,
        type: 'system',
        description: 'System backup completed successfully',
        timestamp: '1 hour ago'
      }
    ])

    const members = ref([
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        tier: 'Platinum',
        points: 25000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        tier: 'Gold',
        points: 15000,
        status: 'active'
      },
      {
        id: 3,
        name: 'Carol Davis',
        email: 'carol@example.com',
        tier: 'Silver',
        points: 8000,
        status: 'suspended'
      }
    ])

    const partners = ref([
      {
        id: 1,
        name: 'Coffee Shop Co',
        category: 'Food & Beverage',
        members: 1250,
        pointsIssued: 125000,
        commission: 2.5,
        status: 'active'
      },
      {
        id: 2,
        name: 'Fashion Boutique',
        category: 'Retail',
        members: 890,
        pointsIssued: 89000,
        commission: 3.0,
        status: 'active'
      },
      {
        id: 3,
        name: 'Fitness Center',
        category: 'Health & Wellness',
        members: 650,
        pointsIssued: 65000,
        commission: 2.0,
        status: 'inactive'
      }
    ])

    const tierSettings = ref([
      { name: 'Bronze', minPoints: 0, multiplier: 1.0 },
      { name: 'Silver', minPoints: 5000, multiplier: 1.2 },
      { name: 'Gold', minPoints: 15000, multiplier: 1.5 },
      { name: 'Platinum', minPoints: 30000, multiplier: 2.0 }
    ])

    const filteredMembers = computed(() => {
      if (!memberSearch.value) return members.value
      return members.value.filter(member =>
        member.name.toLowerCase().includes(memberSearch.value.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearch.value.toLowerCase())
      )
    })

    return {
      activeTab,
      memberSearch,
      tabs,
      adminStats,
      recentActivity,
      members,
      partners,
      tierSettings,
      filteredMembers
    }
  },
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-purple-600">LoyaltyPro Admin</h1>
              <div class="hidden md:block ml-10">
                <div class="flex items-baseline space-x-4">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-sm">A</span>
                </div>
                <span class="text-sm font-medium text-gray-700">Admin</span>
              </div>
              <button @click="$emit('logout')" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- System Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Total Members</h3>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats.totalMembers.toLocaleString() }}</p>
              <p class="text-sm text-green-600">+12% from last month</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Active Partners</h3>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats.activePartners.toLocaleString() }}</p>
              <p class="text-sm text-green-600">+5% from last month</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Points Circulating</h3>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats.pointsCirculating.toLocaleString() }}</p>
              <p class="text-sm text-blue-600">+8% from last month</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">System Revenue</h3>
              <p class="text-2xl font-bold text-gray-900">\${{ adminStats.systemRevenue.toLocaleString() }}</p>
              <p class="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Recent System Activity</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-for="activity in recentActivity" :key="activity.id" class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      activity.type === 'member' ? 'bg-blue-100' :
                      activity.type === 'partner' ? 'bg-green-100' :
                      'bg-purple-100'
                    ]">
                      <svg v-if="activity.type === 'member'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <svg v-else-if="activity.type === 'partner'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                      <p class="text-sm text-gray-500">{{ activity.timestamp }}</p>
                    </div>
                  </div>
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    activity.type === 'member' ? 'bg-blue-100 text-blue-800' :
                    activity.type === 'partner' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  ]">
                    {{ activity.type }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Members Tab -->
        <div v-if="activeTab === 'members'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Member Management</h2>
            <div class="flex space-x-4">
              <input
                v-model="memberSearch"
                type="text"
                placeholder="Search members..."
                class="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <button class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="member in filteredMembers" :key="member.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span class="text-purple-600 font-semibold text-sm">{{ member.name.charAt(0) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                        <div class="text-sm text-gray-500">{{ member.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ member.tier }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ member.points.toLocaleString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ member.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Suspend</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Partners Tab -->
        <div v-if="activeTab === 'partners'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Partner Management</h2>
            <button class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Add Partner
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="partner in partners" :key="partner.id" class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ partner.name }}</h3>
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ partner.status }}
                </span>
              </div>
              <div class="space-y-2 text-sm text-gray-600">
                <p><span class="font-medium">Category:</span> {{ partner.category }}</p>
                <p><span class="font-medium">Members:</span> {{ partner.members.toLocaleString() }}</p>
                <p><span class="font-medium">Points Issued:</span> {{ partner.pointsIssued.toLocaleString() }}</p>
                <p><span class="font-medium">Commission:</span> {{ partner.commission }}%</p>
              </div>
              <div class="mt-4 flex space-x-2">
                <button class="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm hover:bg-purple-700 transition-colors">
                  Manage
                </button>
                <button class="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-400 transition-colors">
                  Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">System Settings</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- General Settings -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                  <input
                    type="text"
                    value="LoyaltyPro"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Default Point Value</label>
                  <input
                    type="number"
                    value="0.01"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Point Expiry (months)</label>
                  <input
                    type="number"
                    value="24"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
              </div>
            </div>

            <!-- Tier Settings -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Tier Configuration</h3>
              <div class="space-y-4">
                <div v-for="tier in tierSettings" :key="tier.name" class="border border-gray-200 rounded-md p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900">{{ tier.name }}</h4>
                    <button class="text-purple-600 hover:text-purple-700 text-sm">Edit</button>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Min Points:</span>
                      <span class="ml-2 font-medium">{{ tier.minPoints.toLocaleString() }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Multiplier:</span>
                      <span class="ml-2 font-medium">{{ tier.multiplier }}x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p class="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-purple-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
                </button>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Session Timeout</h4>
                  <p class="text-sm text-gray-500">Auto-logout after inactivity</p>
                </div>
                <select class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-purple-500 focus:border-purple-500">
                  <option value="30">30 minutes</option>
                  <option value="60" selected>1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
}

// Methods
const handleLogin = async () => {
  isLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock authentication logic
  if (loginForm.value.email && loginForm.value.password) {
    if (selectedLoginType.value === 'consumer') {
      currentUser.value = {
        role: 'consumer',
        name: 'John Doe',
        email: loginForm.value.email,
        points: 12500,
        tier: 'Gold',
        nextTier: 'Platinum',
        tierProgress: 65,
        pointsToNextTier: 2500,
        rewardsEarned: 8,
        memberSince: 'Jan 2023',
        cardNumber: '1234 5678 9012'
      }
    } else if (selectedLoginType.value === 'partner') {
      currentUser.value = {
        role: 'partner',
        name: 'Partner User',
        email: loginForm.value.email,
        organization: 'Coffee Shop Co',
        organizationCode: loginForm.value.organizationCode
      }
    } else if (selectedLoginType.value === 'admin') {
      currentUser.value = {
        role: 'admin',
        name: 'System Admin',
        email: loginForm.value.email,
        accessLevel: 'full'
      }
    }
    
    isAuthenticated.value = true
    showToastMessage(`Welcome back, ${currentUser.value.name}!`)
  } else {
    showToastMessage('Invalid credentials. Please try again.')
  }
  
  isLoading.value = false
}

const handleRegistration = async () => {
  if (registrationForm.value.password !== registrationForm.value.confirmPassword) {
    showToastMessage('Passwords do not match!')
    return
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  showRegistration.value = false
  showToastMessage('Account created successfully! Please log in.')
  
  // Pre-fill login form
  loginForm.value.email = registrationForm.value.email
  
  // Reset registration form
  registrationForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  currentUser.value = null
  loginForm.value = {
    email: '',
    password: '',
    organizationCode: '',
    accessCode: '',
    rememberMe: false
  }
  showToastMessage('Logged out successfully!')
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
