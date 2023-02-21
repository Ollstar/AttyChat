interface Message2 {
    text: string;
    userPrimer: string;
    createdAt: admin.firestore.Timestamp;
    user : {
        _id: string;
        name: string;
        avatar: string;
    }
}