import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/actions/get-current-user';
import prisma from '@/app/libs/prisma.db';


export async function POST (
    request: Request,
) {
    try {
        const currentUser = await getCurrentUser();
        const body        = await request.json();
        const {
                  message,
                  image,
                  conversationId,
              }           = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const newMessage = await prisma.message.create({
            data   : {
                body        : message,
                image       : image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender      : {
                    connect: {
                        id: currentUser.id,
                    },
                },
                seen        : {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            include: {
                seen  : true,
                sender: true,
            },
        });

        const updatedConversation = await prisma.conversation.update({
            where  : {
                id: conversationId,
            },
            data   : {
                lastMessageAt: new Date(),
                messages     : {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users   : true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        return NextResponse.json(newMessage);
    } catch (e: any) {
        console.log(e);
        return new NextResponse('Internal error', { status: 500 });
    }
}