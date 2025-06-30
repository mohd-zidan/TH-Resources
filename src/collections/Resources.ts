import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'type', 'curated_by'],
  },
  fields: [
    {
      name: 'name',
      label: 'Resource Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The primary name of the resource.',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      admin: {
        description: 'Categorize the resource. Type to search or create new.',
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
      required: true,
      admin: {
        description: 'Specify the type of resource (e.g., technical, non-technical).',
      },
    },
    {
      name: 'area',
      label: 'Area',
      type: 'text',
      required: true,
      admin: {
        description: 'Define the specific area or domain of the resource.',
      },
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A brief overview of the resource.',
      },
    },
    {
      name: 'purpose',
      label: 'Purpose',
      type: 'textarea',
      admin: {
        description: 'The main objective or goal of this resource/event.',
      },
    },
    {
      name: 'process',
      label: 'Process / Agenda',
      type: 'textarea',
      admin: {
        description: 'Detailed steps, agenda, or methodology.',
      },
    },
    {
      name: 'expected_outcome',
      label: 'Expected Outcome',
      type: 'textarea',
      admin: {
        description: 'What participants or users should gain or achieve.',
      },
    },
    {
      name: 'impact',
      label: 'Impact',
      type: 'array',
      fields: [
        {
          name: 'impact_item',
          label: 'Impact Statement',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List the potential or actual impacts of this resource.',
      },
    },
    {
      name: 'pre_event_checklist',
      label: 'Pre-Event Checklist',
      type: 'array',
      fields: [
        {
          name: 'checklist_item',
          label: 'Checklist Item',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Items to check or prepare before the event/activity.',
      },
    },
    {
      name: 'post_event_checklist',
      label: 'Post-Event Checklist',
      type: 'array',
      fields: [
        {
          name: 'checklist_item',
          label: 'Checklist Item',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Items to follow up on after the event/activity.',
      },
    },
    {
      name: 'curated_by',
      label: 'Curated By',
      type: 'text',
      admin: {
        description: 'Name or group responsible for curating this resource.',
      },
    },
    {
      name: 'audience',
      label: 'Target Audience',
      type: 'text',
      admin: {
        description: 'The intended audience for this resource (e.g., beginners, experts).',
      },
    },
    {
      name: 'resources_list',
      label: 'Associated Resources',
      type: 'array',
      fields: [
        {
          name: 'resource_item',
          label: 'Resource Link or Description',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of related materials, links, or tools.',
      },
    },
    {
      name: 'event_details', // Changed from 'event' to avoid conflict if 'event' is a keyword or too generic
      label: 'Event Information',
      type: 'array',
      fields: [
        {
          name: 'event_item',
          label: 'Event Detail',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key information related to an event if this resource is for one.',
      },
    },
  ],
  endpoints: [
    {
      path: '/public',
      method: 'get',
      handler: async (req) => {
        const resources = await req.payload.find({
          collection: 'resources',
          depth: 1,
        })

        return Response.json(resources)
      },
    },
  ],
  // Optional: Add hooks for validation or other logic if needed later
  // hooks: {},
  // Optional: Add access control
  // access: { read: () => true, create: () => true, update: () => true, delete: () => true },
}
