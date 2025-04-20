'use client';

// Inspired by react-hot-toast library
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
* Schedules a toast removal operation after a specific delay if not already scheduled.
* @example
* toastHandler('uniqueToastId')
* // Schedules the removal of the toast with the ID 'uniqueToastId' after TOAST_REMOVE_DELAY.
* @param {string} toastId - Unique identifier for the toast that needs to be removed.
* @returns {void} The function does not return a value.
* @description
*   - Ensures a toast is removed only once by checking and storing scheduled timeouts.
*   - Utilizes a constant delay value, TOAST_REMOVE_DELAY, to time the toast removal operation.
*   - Integrates with a dispatch function for state management of toast notifications.
*/
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Manages state transitions for toast notifications based on different action types.
 * @example
 * handleToastAction(state, { type: 'ADD_TOAST', toast: { id: '1', message: 'Hello' } })
 * // Returns updated state with the new toast added to the list.
 * @param {State} state - The current state of the toast notifications.
 * @param {Action} action - An action object specifying how to update the state.
 * @returns {State} Updated state after applying the specified action.
 * @description
 *   - Supports action types: 'ADD_TOAST', 'UPDATE_TOAST', 'DISMISS_TOAST', 'REMOVE_TOAST'.
 *   - Limits the number of active toasts based on the defined TOAST_LIMIT.
 *   - Handles dismissal of toasts by adding them to a removal queue.
 *   - Removes toasts either by specific ID or clears all when no ID is specified.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

/**
 * Creates and manages a toaster notification with an auto-generated ID.
 * @example
 * toast({ message: 'Sample toast' })
 * // Returns: { id: 'uniqueId', dismiss: [Function], update: [Function] }
 * @param {Object} props - The properties of the toast including message and settings.
 * @returns {Object} An object containing the ID, and functions to dismiss or update the toast.
 * @description
 *   - Dispatches an action to add a toast to the toaster component.
 *   - Auto-closes the toast when its `open` state changes to false.
 *   - Provides functions to update or dismiss the toast using the auto-generated ID.
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
* Provides a stateful API for managing toast notifications in a React application.
* @example
* const { toast, dismiss } = useToast();
* toast('Success!');
* dismiss(toastId);
* @returns {object} An object containing the toast state, a toast function to show notifications, and a dismiss function to hide notifications.
* @description
*   - Listeners are managed in a global array to update the component state.
*   - State updates trigger a re-render of the component using this hook.
*   - The clean-up function ensures that the setState listener is removed when the component unmounts.
*/
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
