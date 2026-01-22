/**
 * Room helper logic
  
 */
export const ROOMS = {
    PROJECT: (id) => `project:${id}`,
    USER: (id) => `user:${id}`,
};

export function joinProjectRoom(socket, projectId) {
    socket.join(ROOMS.PROJECT(projectId));
}

export function leaveProjectRoom(socket, projectId) {
    socket.leave(ROOMS.PROJECT(projectId));
}
