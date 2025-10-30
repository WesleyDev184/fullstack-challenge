import type { TaskDto } from '@/http/task/dto/task-dto'
import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'
import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'

export const MOCK_TASKS: TaskDto[] = [
  {
    id: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
    title: 'Auth logic',
    description:
      'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
    dueAt: new Date('2025-11-01T10:00:00.000Z'),
    priority: TaskPriorityEnum.HIGH,
    status: TaskStatusEnum.TODO,
    createdBy: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
    createdAt: new Date('2025-10-26T06:25:28.189Z'),
    updatedAt: new Date('2025-10-26T06:25:33.982Z'),
    assignees: [
      {
        taskId: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
        userId: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
        assignedAt: new Date('2025-10-26T06:18:58.142Z'),
      },
    ],
  },
  {
    id: '3ee2ge03-cddd-54b6-ccd5-57e452d5925b',
    title: 'Criar componente de notificação',
    description:
      'Desenvolver um componente reutilizável de notificação com múltiplos tipos',
    dueAt: new Date('2025-10-28T14:30:00.000Z'),
    priority: TaskPriorityEnum.MEDIUM,
    status: TaskStatusEnum.IN_PROGRESS,
    createdBy: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
    createdAt: new Date('2025-10-24T08:15:45.123Z'),
    updatedAt: new Date('2025-10-27T11:22:50.456Z'),
    assignees: [
      {
        taskId: '3ee2ge03-cddd-54b6-ccd5-57e452d5925b',
        userId: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
        assignedAt: new Date('2025-10-24T09:00:00.000Z'),
      },
      {
        taskId: '3ee2ge03-cddd-54b6-ccd5-57e452d5925b',
        userId: 'e489b6ea-1c6c-534g-c27e-ccd57d36c432',
        assignedAt: new Date('2025-10-25T10:15:30.789Z'),
      },
    ],
  },
  {
    id: '4ff3hf14-deee-65c7-dde6-68f563e6a36c',
    title: 'Implementar testes unitários',
    description: 'Escrever testes unitários para o módulo de autenticação',
    dueAt: new Date('2025-11-05T09:00:00.000Z'),
    priority: TaskPriorityEnum.HIGH,
    status: TaskStatusEnum.REVIEW,
    createdBy: 'c2g22dde-ef52-5g19-cc3f-f2ef9eg3c998',
    createdAt: new Date('2025-10-20T14:45:12.321Z'),
    updatedAt: new Date('2025-10-27T16:33:20.654Z'),
    assignees: [
      {
        taskId: '4ff3hf14-deee-65c7-dde6-68f563e6a36c',
        userId: 'e489b6ea-1c6c-534g-c27e-ccd57d36c432',
        assignedAt: new Date('2025-10-20T15:00:00.000Z'),
      },
    ],
  },
  {
    id: '5gg4ij25-efff-76d8-eef7-79g674f7b47d',
    title: 'Setup do banco de dados',
    description: 'Configurar migrations e seeders do banco de dados PostgreSQL',
    dueAt: new Date('2025-10-25T17:00:00.000Z'),
    priority: TaskPriorityEnum.LOW,
    status: TaskStatusEnum.DONE,
    createdBy: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
    createdAt: new Date('2025-10-18T09:30:00.111Z'),
    updatedAt: new Date('2025-10-24T13:45:15.222Z'),
    assignees: [
      {
        taskId: '5gg4ij25-efff-76d8-eef7-79g674f7b47d',
        userId: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
        assignedAt: new Date('2025-10-18T10:00:00.000Z'),
      },
    ],
  },
  {
    id: '6hh5jk36-fggg-87e9-ffg8-8ah785g8c58e',
    title: 'Documentação da API',
    description:
      'Criar documentação completa da API REST com exemplos de requisições',
    dueAt: new Date('2025-10-31T18:00:00.000Z'),
    priority: TaskPriorityEnum.MEDIUM,
    status: TaskStatusEnum.TODO,
    createdBy: 'c2g22dde-ef52-5g19-cc3f-f2ef9eg3c998',
    createdAt: new Date('2025-10-22T11:20:30.555Z'),
    updatedAt: new Date('2025-10-26T14:10:45.666Z'),
    assignees: [],
  },
  {
    id: '7ii6kl47-ghhi-98fa-ggh9-9bi896h9d69f',
    title: 'Otimizar queries',
    description: 'Identificar e otimizar queries lentas no banco de dados',
    dueAt: new Date('2025-11-10T15:00:00.000Z'),
    priority: TaskPriorityEnum.MEDIUM,
    status: TaskStatusEnum.IN_PROGRESS,
    createdBy: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
    createdAt: new Date('2025-10-23T13:50:20.777Z'),
    updatedAt: new Date('2025-10-27T09:55:35.888Z'),
    assignees: [
      {
        taskId: '7ii6kl47-ghhi-98fa-ggh9-9bi896h9d69f',
        userId: 'e489b6ea-1c6c-534g-c27e-ccd57d36c432',
        assignedAt: new Date('2025-10-23T14:30:00.000Z'),
      },
    ],
  },
  {
    id: '8jj7lm58-hiii-a9gb-hhi0-acj907i0e70g',
    title: 'Melhorar performance do frontend',
    description: 'Implementar lazy loading e code splitting no React',
    dueAt: new Date('2025-11-08T11:00:00.000Z'),
    priority: TaskPriorityEnum.LOW,
    status: TaskStatusEnum.DONE,
    createdBy: 'c2g22dde-ef52-5g19-cc3f-f2ef9eg3c998',
    createdAt: new Date('2025-10-19T10:15:50.999Z'),
    updatedAt: new Date('2025-10-26T16:20:55.101Z'),
    assignees: [
      {
        taskId: '8jj7lm58-hiii-a9gb-hhi0-acj907i0e70g',
        userId: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
        assignedAt: new Date('2025-10-19T10:45:00.000Z'),
      },
      {
        taskId: '8jj7lm58-hiii-a9gb-hhi0-acj907i0e70g',
        userId: 'e489b6ea-1c6c-534g-c27e-ccd57d36c432',
        assignedAt: new Date('2025-10-20T08:30:00.000Z'),
      },
    ],
  },
  {
    id: '9kk8mn69-ijjj-bah0-iji1-bdk08j1f81h',
    title: 'Integração com pagamento',
    description: 'Integrar sistema de pagamento com Stripe',
    dueAt: new Date('2025-11-15T16:30:00.000Z'),
    priority: TaskPriorityEnum.HIGH,
    status: TaskStatusEnum.TODO,
    createdBy: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
    createdAt: new Date('2025-10-25T15:40:10.202Z'),
    updatedAt: new Date('2025-10-27T12:05:25.303Z'),
    assignees: [
      {
        taskId: '9kk8mn69-ijjj-bah0-iji1-bdk08j1f81h',
        userId: 'e489b6ea-1c6c-534g-c27e-ccd57d36c432',
        assignedAt: new Date('2025-10-25T16:00:00.000Z'),
      },
    ],
  },
]
