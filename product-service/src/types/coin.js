export const schema = {
    type: "object",
    properties: {
      price: {type: "integer"},
      title: {type: "string", minLength: 1},
      count: {type: "integer"},
      description: {type: "string"}
    },
    required: ['price', 'title', 'count', 'description']
}