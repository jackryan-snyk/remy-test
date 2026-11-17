package com.example.todo;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TodoStoreTest {

    @Test
    void addsAndTrimsItems() {
        TodoStore store = new TodoStore();
        store.add("  write tests ");
        assertEquals(List.of("write tests"), store.all());
    }

    @Test
    void rejectsBlankItems() {
        TodoStore store = new TodoStore();
        assertThrows(IllegalArgumentException.class, () -> store.add("  "));
    }

    @Test
    void findsOverlap() {
        TodoStore store = new TodoStore();
        store.add("a");
        store.add("b");
        assertTrue(store.overlap(List.of("b", "c")).contains("b"));
        assertEquals(1, store.overlap(List.of("b", "c")).size());
    }

    @Test
    void buildsPoolConfig() {
        ComboPooledDataSource ds = TodoStore.poolConfig("jdbc:h2:mem:test", 5);
        assertEquals("jdbc:h2:mem:test", ds.getJdbcUrl());
        assertEquals(5, ds.getMaxPoolSize());
        ds.close();
    }
}
