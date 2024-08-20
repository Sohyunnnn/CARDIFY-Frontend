import axiosInstance from '..';

export const getNoteToFolder = async (folderId,  page,size) => {
    try {
        const response = await axiosInstance.post('/notes/getNoteToFolder', {
            folderId,
            page,
            size
        });
        console.log(folderId,  size)
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notes for the folder:', error);
        throw error;
    }
};

export default getNoteToFolder;
